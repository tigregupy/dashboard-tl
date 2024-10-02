const getTeamsProjects = ({ productName, year, period, startDate, endDate }) => {
  const h1 = ['h1', 'q1', 'q2', 'jan', 'feb', 'mar', 'apr', 'may', 'jun'];
  const h2 = ['h2', 'q3', 'q4', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
  const tribeRecrutamentoLabel = 'Tribo Recrutamento';
  const tribeSelecaoLabel = 'Tribo Sel & Adm';

  if (productName === 'C&E') {
    const pes = { name: 'Pesquisas', project: 'CEP', startDate, endDate };
    const jad = { name: 'Jornada Admin', project: 'JAD', startDate, endDate };

    return [pes, jad];
  }

  if (productName === 'Edu. Corp.') {
    const gp = { name: 'Gestão de pessoas', project: 'LMS', startDate, endDate };
    const gc = { name: 'Gestão de conteúdo', project: 'COI', startDate, endDate };
    const colab = { name: 'Colaborador', project: 'LEXP', startDate, endDate };
    const hab = { name: 'Habilitação', project: 'EDCH', startDate, endDate };

    return [gp, gc, colab, hab];
  }

  if (productName === 'Ecossistema') {
    const aut = { name: 'Gestão de Contas', project: 'AUT', startDate, endDate };
    const ju = { name: 'Jornada Única', project: 'TJU', startDate, endDate };
    const ana = { name: 'Analytics', project: 'TA', startDate, endDate };
    const vis = { name: 'Visionários', project: 'VIS', startDate, endDate };

    return [aut, ju, ana, vis];
  }

  if (productName === 'Perf. & Desenv.') {
    const per = { name: 'Performance', project: 'PER', startDate, endDate };
    const reb = { name: 'Rebranding', project: 'REB', startDate, endDate };

    return [per, reb];
  }

  if (productName === 'R&S & Admissão') {
    const cur = { name: 'Currículo', project: 'CV', startDate, endDate, tribe: tribeRecrutamentoLabel };
    const div = { name: 'Divulgação', project: 'DIV', startDate, endDate, tribe: tribeRecrutamentoLabel };
    const cap = { name: 'Captação', project: 'CAP', startDate, endDate, tribe: tribeRecrutamentoLabel };
    const qua = { name: 'Qualificação', project: 'SHELL', startDate, endDate, tribe: tribeRecrutamentoLabel };
    const emp = { name: 'Empregabilidade', project: 'EMP', startDate, endDate, tribe: tribeRecrutamentoLabel };
    const inb = { name: 'Inbound', project: 'Inbound', startDate, endDate, tribe: tribeSelecaoLabel };
    const tri = { name: 'Triagem', project: 'TRIA', startDate, endDate, tribe: tribeSelecaoLabel };
    const aga = { name: 'Gestão de Adm', project: 'AGA', startDate, endDate, tribe: tribeSelecaoLabel };
    const agd = { name: 'Gestão de D&I', project: 'AGD', startDate, endDate, tribe: tribeSelecaoLabel };
    const con = { name: 'Contratação', project: 'TRIA', startDate, endDate, tribe: tribeSelecaoLabel };
    const mov = { name: 'Movimentação', project: 'MOV', startDate, endDate, tribe: tribeSelecaoLabel };
    const vag = { name: 'Vagas', project: 'VAGAS', startDate, endDate, tribe: tribeSelecaoLabel };
    const ana = { name: 'Analytics', project: 'TA', startDate, endDate, tribe: tribeSelecaoLabel };

    year = parseInt(year, 10)

    if (year <= 2022) {
      inb.tribe = tribeRecrutamentoLabel;
      qua.tribe = tribeSelecaoLabel;

      return [cur, inb, emp, cap, qua, vag, con, ana];
    }

    if (year === 2023 && h1.includes(period)) {
      inb.tribe = tribeRecrutamentoLabel;
      qua.tribe = tribeSelecaoLabel;

      return [cur, inb, div, cap, qua, vag, con, mov];
    }

    if (year === 2023 && h2.includes(period)) {
      return [cur, qua, div, cap, inb, con, mov, aga, agd];
    }

    return [cur, qua, div, cap, inb, tri, aga, agd];
  }

  return [];
}

export {
  getTeamsProjects,
};