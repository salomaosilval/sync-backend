import {
  ModuleMapper,
  TransformResult,
  cleanCnpjCpf,
  formatDate,
} from './base.mapper';

export class EmpenhoMapper implements ModuleMapper {
  transform(input: Record<string, unknown>): TransformResult {
    const credor = input.credor as Record<string, unknown> | undefined;

    const payload: Record<string, unknown> = {
      dadosEmpenho: {
        numeroEmpenho: input.numero ?? input.numeroEmpenho,
        tipoEmpenho: input.tipo ?? input.tipoEmpenho,
        valorEmpenho: input.valor ?? input.valorEmpenho,
        dataEmpenho: formatDate((input.data as string) ?? ''),
        naturezaDespesa: input.naturezaDespesa,
        fonte: input.fonte ?? input.fonteRecurso,
        credor: credor
          ? {
              documento: cleanCnpjCpf(
                (credor.cnpj ?? credor.cpf ?? '') as string,
              ),
              nome: credor.razaoSocial ?? credor.nome,
            }
          : null,
        descricao: input.descricao ?? input.objeto,
      },
    };

    this.copyExtraFields(
      input,
      payload.dadosEmpenho as Record<string, unknown>,
    );

    return { success: true, payload };
  }

  private copyExtraFields(
    input: Record<string, unknown>,
    target: Record<string, unknown>,
  ): void {
    const knownFields = [
      'numero',
      'numeroEmpenho',
      'tipo',
      'tipoEmpenho',
      'valor',
      'valorEmpenho',
      'data',
      'naturezaDespesa',
      'fonte',
      'fonteRecurso',
      'credor',
      'descricao',
      'objeto',
    ];

    for (const key of Object.keys(input)) {
      if (!knownFields.includes(key)) {
        target[key] = input[key];
      }
    }
  }
}
