import {
  ModuleMapper,
  TransformResult,
  cleanCnpjCpf,
  formatDate,
} from './base.mapper';

export class CompraDiretaMapper implements ModuleMapper {
  transform(input: Record<string, unknown>): TransformResult {
    const fornecedor = input.fornecedor as Record<string, unknown> | undefined;

    const payload: Record<string, unknown> = {
      dadosCompraDireta: {
        numeroCompraDireta: input.numero ?? input.numeroCompraDireta,
        tipoObjeto: input.tipoObjeto,
        valorTotal: input.valor ?? input.valorTotal,
        dataRealizacao: formatDate(
          ((input.data ?? input.dataRealizacao) as string) ?? '',
        ),
        fundamentoLegal: input.fundamentoLegal ?? input.amparo,
        descricao: input.descricao ?? input.objeto,
        fornecedor: fornecedor
          ? {
              documento: cleanCnpjCpf(
                (fornecedor.cnpj ?? fornecedor.cpf ?? '') as string,
              ),
              nome: fornecedor.razaoSocial ?? fornecedor.nome,
            }
          : null,
      },
    };

    this.copyExtraFields(
      input,
      payload.dadosCompraDireta as Record<string, unknown>,
    );

    return { success: true, payload };
  }

  private copyExtraFields(
    input: Record<string, unknown>,
    target: Record<string, unknown>,
  ): void {
    const knownFields = [
      'numero',
      'numeroCompraDireta',
      'tipoObjeto',
      'valor',
      'valorTotal',
      'data',
      'dataRealizacao',
      'fundamentoLegal',
      'amparo',
      'descricao',
      'objeto',
      'fornecedor',
    ];

    for (const key of Object.keys(input)) {
      if (!knownFields.includes(key)) {
        target[key] = input[key];
      }
    }
  }
}
