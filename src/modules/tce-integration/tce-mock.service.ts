import { Injectable, Logger } from '@nestjs/common';

export interface TceResponse {
  success: boolean;
  protocolo?: string;
  message?: string;
  errors?: string[];
}

@Injectable()
export class TceMockService {
  private readonly logger = new Logger(TceMockService.name);

  async sendToTce(
    endpoint: string,
    payload: Record<string, unknown>,
  ): Promise<TceResponse> {
    this.logger.log(`[MOCK] Enviando para TCE: ${endpoint}`);
    this.logger.debug(`[MOCK] Payload: ${JSON.stringify(payload)}`);

    await this.simulateNetworkDelay();

    const shouldFail = Math.random() < 0.1;

    if (shouldFail) {
      return {
        success: false,
        message: 'Erro simulado do TCE',
        errors: ['Serviço temporariamente indisponível'],
      };
    }

    const protocolo = this.generateProtocol();

    this.logger.log(`[MOCK] Protocolo gerado: ${protocolo}`);

    return {
      success: true,
      protocolo,
      message: 'Remessa recebida com sucesso',
    };
  }

  private async simulateNetworkDelay(): Promise<void> {
    const delay = Math.floor(Math.random() * 500) + 100;
    return new Promise((resolve) => setTimeout(resolve, delay));
  }

  private generateProtocol(): string {
    const year = new Date().getFullYear();
    const randomNum = Math.floor(Math.random() * 1000000)
      .toString()
      .padStart(6, '0');
    return `${year}-${randomNum}`;
  }
}
