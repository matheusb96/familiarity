// All scenario text and snippets are synthetic, authored for Familiarity.
export const nodes = {
  request: {
    name: "Pedido de exportação",
    short: "Filtros escolhidos",
    title: "A pessoa escolhe o recorte.",
    text: "O formulário fictício envia o período que deve aparecer no relatório. A interação inicia uma exportação.",
    receives: "Período selecionado",
    sends: "Pedido de relatório",
    proposed: "Mostrar progresso?",
    change:
      "Uma exportação demorada pode precisar informar que o pedido foi recebido.",
  },
  prepare: {
    name: "Preparação",
    short: "Busca e organiza dados",
    title: "O relatório ganha forma.",
    text: "Neste exemplo, a preparação consulta os registros e escolhe as colunas antes de produzir o arquivo.",
    receives: "Filtros",
    sends: "Linhas para exportar",
    proposed: "Processar depois?",
    change: "Preparar em segundo plano muda quando o arquivo fica disponível.",
  },
  format: {
    name: "Formato CSV",
    short: "Transforma linhas em texto",
    title: "Uma biblioteca cuida do formato.",
    text: "O adaptador fictício usa Papa Parse para transformar linhas em texto CSV. O protótipo apenas mostra essa chamada; não executa a biblioteca.",
    receives: "Linhas do relatório",
    sends: "Texto CSV",
    proposed: "Formato estável",
    change:
      "Mudar a entrega não exige necessariamente mudar o formato do arquivo.",
  },
  delivery: {
    name: "Entrega",
    short: "Disponibiliza o arquivo",
    title: "O resultado chega a quem pediu.",
    text: "O exemplo retorna o nome e o conteúdo do arquivo. Ainda não há armazenamento nem acompanhamento de trabalhos em segundo plano.",
    receives: "Conteúdo CSV",
    sends: "Arquivo para download",
    proposed: "Buscar mais tarde?",
    change:
      "Uma entrega posterior precisa de um lugar onde a pessoa encontre o resultado.",
  },
  entry: {
    name: "Entrada",
    short: "Interpreta os filtros",
    title: "Defina o que pode entrar.",
    text: "A função ilustrativa extrai início e fim do pedido. Um sistema real ainda precisaria validar datas e autorização.",
    receives: "Pedido",
    sends: "Filtros",
    proposed: "Validar no servidor",
    change: "O exemplo não representa uma fronteira pronta para produção.",
  },
  policy: {
    name: "Volume",
    short: "Quantidade de linhas",
    title: "O tamanho muda a experiência.",
    text: "A função ilustrativa conta as linhas. Ela ajuda a discutir tempo de espera, mas não mede duração nem escolhe um limite.",
    receives: "Linhas",
    sends: "Quantidade",
    proposed: "Definir um limite?",
    change:
      "Precisamos observar volume e tempo antes de decidir quando executar em segundo plano.",
  },
  attempt: {
    name: "Resultado",
    short: "Nome e conteúdo",
    title: "Dê uma identidade ao arquivo.",
    text: "A preparação devolve um nome e o conteúdo CSV. Neste cenário, não existe um registro persistente da execução.",
    receives: "Texto CSV",
    sends: "Descrição do arquivo",
    proposed: "Guardar o andamento?",
    change:
      "A execução em segundo plano pode precisar de estados como aguardando, pronto e falhou.",
  },
};
export const hypotheses = {
  immediate: {
    title: "Esperar pelo download.",
    text: "A experiência é direta, mas precisamos investigar volume e tempo de resposta antes de assumir que a espera é aceitável.",
    strip: "Hipótese: entregar o arquivo na mesma interação.",
  },
  background: {
    title: "Preparar em segundo plano.",
    text: "A pessoa pode continuar trabalhando. Agora precisamos entender acompanhamento, falhas e acesso ao arquivo pronto.",
    strip: "Hipótese: preparar o arquivo e disponibilizar depois.",
  },
  unknown: {
    title: "A escolha pode esperar.",
    text: "Vamos explorar a preparação para descobrir quais informações faltam antes de escolher a experiência.",
    strip: "Em aberto: como lidar com o tempo de preparação.",
  },
};
export const learning = {
  request: {
    purpose:
      "O formulário fictício envia o período que deve aparecer no relatório. A interação inicia uma exportação.",
    steps: [
      "A pessoa escolhe um período.",
      "O formulário monta os filtros.",
      "A preparação recebe o pedido.",
    ],
    terms: [
      [
        "Filtro",
        "Uma condição que delimita quais dados entram no relatório. Aqui, um período escolhido pela pessoa.",
      ],
    ],
    implication:
      "Uma exportação demorada pode precisar informar que o pedido foi recebido.",
  },
  prepare: {
    purpose:
      "Neste exemplo, a preparação consulta os registros e escolhe as colunas antes de produzir o arquivo.",
    steps: [
      "Obtém as linhas do relatório.",
      "Transforma as linhas em CSV.",
      "Devolve o arquivo preparado.",
    ],
    terms: [
      [
        "Orquestração",
        "A coordenação de etapas. No exemplo, buscar dados, transformá-los e preparar o resultado.",
      ],
      [
        "Segundo plano",
        "Executar um trabalho depois de aceitar o pedido, sem exigir que a pessoa espere na mesma tela.",
      ],
    ],
    implication:
      "Preparar em segundo plano muda quando o arquivo fica disponível.",
  },
  format: {
    purpose:
      "O adaptador fictício usa Papa Parse para transformar linhas em texto CSV. O protótipo apenas mostra essa chamada; não executa a biblioteca.",
    steps: [
      "Recebe um conjunto de linhas.",
      "Chama Papa.unparse no exemplo.",
      "Devolve o texto produzido.",
    ],
    terms: [
      [
        "Adaptador",
        "Código que conecta uma operação da aplicação a uma interface diferente. Aqui, encodeCsv concentra a chamada à biblioteca de CSV.",
      ],
      [
        "CSV",
        "Um formato textual para dados tabulares. A biblioteca lida com delimitadores e aspas.",
      ],
      [
        "Dependência externa",
        "Código mantido por outro projeto. Papa Parse é uma biblioteca real; seu uso aqui é apenas um exemplo didático.",
      ],
    ],
    implication:
      "Mudar a entrega não exige necessariamente mudar o formato do arquivo.",
  },
  delivery: {
    purpose:
      "O exemplo retorna o nome e o conteúdo do arquivo. Ainda não há armazenamento nem acompanhamento de trabalhos em segundo plano.",
    steps: [
      "Recebe o conteúdo pronto.",
      "Define um nome para o arquivo.",
      "Disponibiliza o resultado para a interface.",
    ],
    terms: [
      [
        "Entrega",
        "A forma como a pessoa recebe o resultado: uma resposta imediata ou um arquivo disponível depois.",
      ],
    ],
    implication:
      "Uma entrega posterior precisa de um lugar onde a pessoa encontre o resultado.",
  },
  entry: {
    purpose:
      "A função ilustrativa extrai início e fim do pedido. Um sistema real ainda precisaria validar datas e autorização.",
    steps: [
      "Lê o início do período.",
      "Lê o fim do período.",
      "Entrega os filtros à preparação.",
    ],
    terms: [
      [
        "Fronteira",
        "O ponto por onde dados externos entram no sistema. Esse é um lugar para interpretar e rejeitar entradas inválidas.",
      ],
    ],
    implication: "O exemplo não representa uma fronteira pronta para produção.",
  },
  policy: {
    purpose:
      "A função ilustrativa conta as linhas. Ela ajuda a discutir tempo de espera, mas não mede duração nem escolhe um limite.",
    steps: [
      "Recebe as linhas.",
      "Conta os registros.",
      "Usa a contagem como ponto de discussão, sem limite automático.",
    ],
    terms: [
      [
        "Limite de volume",
        "Uma regra sobre quanto trabalho aceitar de uma vez. Escolher um número sem medição pode esconder problemas.",
      ],
    ],
    implication:
      "Precisamos observar volume e tempo antes de decidir quando executar em segundo plano.",
  },
  attempt: {
    purpose:
      "A preparação devolve um nome e o conteúdo CSV. Neste cenário, não existe um registro persistente da execução.",
    steps: [
      "Recebe o CSV.",
      "Associa o nome relatorio.csv.",
      "Retorna uma descrição do arquivo.",
    ],
    terms: [
      [
        "Estado da execução",
        "Uma informação que permite acompanhar o trabalho. O exemplo não implementa esse acompanhamento.",
      ],
    ],
    implication:
      "A execução em segundo plano pode precisar de estados como aguardando, pronto e falhou.",
  },
};
export const evidence = {
  request: [
    {
      path: "exemplo/form.js",
      line: 1,
      end: 6,
      title: "Monta os filtros",
      code: "// Exemplo fictício, não executado.\nconst filters = {\n  from: form.from.value,\n  to: form.to.value,\n};\nrequestReport(filters);",
    },
  ],
  prepare: [
    {
      path: "exemplo/prepare.js",
      line: 1,
      end: 6,
      title: "Coordena a preparação",
      code: "// Exemplo fictício, não executado.\nasync function prepareReport(filters) {\n  const rows = await loadRows(filters);\n  const content = encodeCsv(rows);\n  return makeFile(content);\n}",
    },
  ],
  format: [
    {
      path: "exemplo/csv.js",
      line: 1,
      end: 4,
      title: "Converte linhas em CSV",
      code: "// Exemplo fictício, não executado.\nfunction encodeCsv(rows) {\n  return Papa.unparse(rows, { escapeFormulae: true });\n}",
    },
  ],
  delivery: [
    {
      path: "exemplo/delivery.js",
      line: 1,
      end: 3,
      title: "Entrega a descrição do arquivo",
      code: "// Exemplo fictício, não executado.\nconst file = await prepareReport(filters);\nshowDownload(file);",
    },
  ],
  entry: [
    {
      path: "exemplo/filters.js",
      line: 1,
      end: 4,
      title: "Interpreta os campos",
      code: "// Exemplo fictício, não executado.\nfunction readFilters(input) {\n  return { from: input.from, to: input.to };\n}",
    },
  ],
  policy: [
    {
      path: "exemplo/volume.js",
      line: 1,
      end: 4,
      title: "Conta os registros",
      code: "// Exemplo fictício, não executado.\nfunction reportSize(rows) {\n  return rows.length;\n}",
    },
  ],
  attempt: [
    {
      path: "exemplo/file.js",
      line: 1,
      end: 4,
      title: "Identifica o resultado",
      code: '// Exemplo fictício, não executado.\nfunction makeFile(content) {\n  return { name: "relatorio.csv", content };\n}',
    },
  ],
};
export const fileRoles = {
  "exemplo/form.js":
    "O formulário fictício envia o período que deve aparecer no relatório. A interação inicia uma exportação.",
  "exemplo/prepare.js":
    "Neste exemplo, a preparação consulta os registros e escolhe as colunas antes de produzir o arquivo.",
  "exemplo/csv.js":
    "O adaptador fictício usa Papa Parse para transformar linhas em texto CSV. O protótipo apenas mostra essa chamada; não executa a biblioteca.",
  "exemplo/delivery.js":
    "O exemplo retorna o nome e o conteúdo do arquivo. Ainda não há armazenamento nem acompanhamento de trabalhos em segundo plano.",
  "exemplo/filters.js":
    "A função ilustrativa extrai início e fim do pedido. Um sistema real ainda precisaria validar datas e autorização.",
  "exemplo/volume.js":
    "A função ilustrativa conta as linhas. Ela ajuda a discutir tempo de espera, mas não mede duração nem escolhe um limite.",
  "exemplo/file.js":
    "A preparação devolve um nome e o conteúdo CSV. Neste cenário, não existe um registro persistente da execução.",
};
export const dependencies = {
  format: [
    {
      name: "Papa Parse",
      kind: "Biblioteca JavaScript · exemplo",
      role: "No trecho fictício, unparse transforma linhas em texto CSV.",
      evidenceTitle: "Converte linhas em CSV",
      doc: "https://www.papaparse.com/docs#json-to-csv",
      docLabel: "Documentação oficial",
      unknown:
        "A biblioteca não é carregada pelo protótipo. O exemplo não define arquitetura de produção.",
    },
  ],
};
