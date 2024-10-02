import React, { useState, useEffect } from 'react';
import { view } from '@forge/bridge';

import Edit from './Edit';
import View from './View';

const App = () => {
  const [context, setContext] = useState();

  useEffect(() => {
    view.getContext().then(setContext);
  }, []);

  if (!context) {
    return (<p>Carregando...</p>);
  }

  return context.extension.entryPoint === 'edit'
    ? <Edit />
    : <View configData={context.extension.gadgetConfiguration} />;
};

export default App;