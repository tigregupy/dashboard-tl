const getN3Team = (project) => {    
    if (project === 'LMS') {
      return 'Gestão';
    }
    if (project === 'COI') {
        return 'Conteúdo';
    }
    if (project === 'LEXP') {
      return 'Colaborador';
    }
    if (project === 'EDCH') {
      return 'Habilitação';
    }

    return "";
}

const getIniTeam = (project) => {    
  if (project === 'LMS') {
    return 'Gestão de pessoas';
  }
  if (project === 'COI') {
      return 'Conteúdo';
  }
  if (project === 'LEXP') {
    return 'Colaborador';
  }
  if (project === 'EDCH') {
    return 'Habilitação';
  }

  return "";
}

export {
    getN3Team,
    getIniTeam
}