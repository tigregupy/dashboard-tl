import React, { useState, useEffect } from 'react';
import { view } from '@forge/bridge';
import he from 'he';

import Textfield from '@atlaskit/textfield';
import Toggle from '@atlaskit/toggle';
import Button from '@atlaskit/button/standard-button';
import Select from '@atlaskit/select';
import { Grid } from '@atlaskit/primitives';
import SectionMessage from '@atlaskit/section-message';
import { Code } from '@atlaskit/code';

import Form, { FormFooter, ErrorMessage } from '@atlaskit/form';

const validateYear = (year) => {
  const currentYear = new Date().getFullYear();

  if (year.toString().length !== 4) {
    return false;
  }

  if (year < 2018 || year > currentYear) {
    return false;
  }

  return true;
}

const Edit = () => {
  const [form, setForm] = useState({
    year: '2024',
    productName: '',
    h1: true,
    h2: true,
    q1: false,
    q2: false,
    q3: false,
    q4: false,
    h1Months: true,
    h2Months: true,
    showCountTasksDone: true,
    showCountBugsCreated: true,
    showBugRate: true,
    indexesVisibility: {
      totalInitiativesDone: true,
      totalEpicsDone: true,
      totalTasksDone: true,
      totalTP: true,
      totalIssuesDone: true,
      totalTasksStoriesDone: true,
      totalStoriesDone: true,
      totalStrategicTasksDone: true,
      totalNotStrategicTasksDone: true,
      strategicAlignment: true,
      totalSubTasksDone: true,
      totalBugsDone: true,
      totalBugsCreated: true,
      totalBugsNewImplementationCreated: true,
      totalBugsN3Created: true,
      bugRate: true,
      n3TicketsCreated: true,
      totalActionItensN3Created: true,
    },
  });
  const [yearError, setYearError] = useState(false);

  useEffect(() => {
    const getData = async () => {
      const context = await view.getContext();
      const { gadgetConfiguration } = context.extension;
      gadgetConfiguration.productName = he.decode(gadgetConfiguration.productName);
      setForm({
        ...form,
        ...gadgetConfiguration,
      });
    };
    getData();
  }, []);

  const handleSubmit = async () => {
    const isYearValid = validateYear(form.year);

    if (isYearValid) {
      setYearError(false);
      await view.submit({ ...form });
    } else {
      setYearError(true);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm({ ...form, [name]: value });
  };

  const handleSelectChange = ({ value }) => {
    setForm({ ...form, productName: value });
  };

  const handleToggleChange = (event) => {
    const { name, checked } = event.target;
    setForm({ ...form, [name]: checked });
  };

  const handleIndexesVisibilityToggleChange = (event) => {
    const { name, checked } = event.target;
    const indexesVisibility = { ...form.indexesVisibility, [name]: checked };
    setForm({ ...form, indexesVisibility });
  };

  const productOptions = [
    { label: 'R&S & Admissão', value: 'R&S & Admissão' },
    { label: 'C&E', value: 'C&E' },
    { label: 'Edu. Corp.', value: 'Edu. Corp.' },
    { label: 'Ecossistema', value: 'Ecossistema' },
    { label: 'Perf. & Desenv.', value: 'Perf. & Desenv.' },
  ];

  const selectProductValue = productOptions.filter(o => o.value === form.productName);

  return (
    <div
      style={{
        display: 'flex',
        width: '700px',
        margin: '0 auto',
        flexDirection: 'column',
      }}
    >
      <SectionMessage>
        <p>Oi! Para entender profundamente cada um dos indicadores, acesse a modal de informações onde todos estão bem detalhados. Qualquer dúvida envie mensagem para o <Code>@nando</Code> no Slack 😉</p>
      </SectionMessage>
      <Form onSubmit={handleSubmit}>
        {({ formProps }) => (
          <form {...formProps}>
            <label htmlFor="year">Ano</label>
            <Textfield id="year" name="year" aria-label="year" isRequired value={form.year} onChange={handleChange} />
            {yearError && (
              <ErrorMessage>
                O ano precisa ser um número, mínimo 2018 e máximo o ano atual.
              </ErrorMessage>
            )}
            <br />
            <label htmlFor="year">Produto</label>
            <Select
              inputId="productName"
              className="single-select"
              classNamePrefix="react-select"
              options={productOptions}
              placeholder="Escolha um produto"
              onChange={handleSelectChange}
              value={selectProductValue}
              required
            />
            <br />
            <label>Períodos</label>
            <Grid gap="space.025" alignItems="center" templateColumns="1fr 1fr">
              <div>
                <Toggle id="h1" name="h1" isChecked={form.h1} onChange={handleToggleChange} />
                <label htmlFor="h1">H1</label>
              </div>
              <div>
                <Toggle id="h2" name="h2" isChecked={form.h2} onChange={handleToggleChange} />
                <label htmlFor="h2">H2</label>
              </div>
              <div>
                <Toggle id="q1" name="q1" isChecked={form.q1} onChange={handleToggleChange} />
                <label htmlFor="q1">Q1</label>
              </div>
              <div>
                <Toggle id="q3" name="q3" isChecked={form.q3} onChange={handleToggleChange} />
                <label htmlFor="q3">Q3</label>
              </div>
              <div>
                <Toggle id="q2" name="q2" isChecked={form.q2} onChange={handleToggleChange} />
                <label htmlFor="q2">Q2</label>
              </div>
              <div>
                <Toggle id="q4" name="q4" isChecked={form.q4} onChange={handleToggleChange} />
                <label htmlFor="q4">Q4</label>
              </div>
              <div>
                <Toggle id="h1Months" name="h1Months" isChecked={form.h1Months} onChange={handleToggleChange} />
                <label htmlFor="h1Months">Meses do H1</label>
              </div>
              <div>
                <Toggle id="h2Months" name="h2Months" isChecked={form.h2Months} onChange={handleToggleChange} />
                <label htmlFor="h2Months">Meses do H2</label>
              </div>
            </Grid>
            <br />
            <label>Gráficos</label>
            <Grid gap="space.025" alignItems="center">
              <div>
                <Toggle id="showCountTasksDone" name="showCountTasksDone" isChecked={form.showCountTasksDone} onChange={handleToggleChange} />
                <label htmlFor="showCountTasksDone">Gráfico de tarefas done</label>
              </div>
              <div>
                <Toggle id="showCountBugsCreated" name="showCountBugsCreated" isChecked={form.showCountBugsCreated} onChange={handleToggleChange} />
                <label htmlFor="showCountBugsCreated">Gráfico de bugs criados</label>
              </div>
              <div>
                <Toggle id="showBugRate" name="showBugRate" isChecked={form.showBugRate} onChange={handleToggleChange} />
                <label htmlFor="showBugRate">Gráfico da taxa de bugs</label>
              </div>
            </Grid>
            <br />
            <label>Indicadores</label>
            <Grid gap="space.025" alignItems="center" templateColumns="1fr 1fr">
              <div>
                <Toggle id="totalInitiativesDone" name="totalInitiativesDone" isChecked={form.indexesVisibility.totalInitiativesDone} onChange={handleIndexesVisibilityToggleChange} />
                <label htmlFor="'totalInitiativesDone">Iniciativas done</label>
              </div>
              <div>
                <Toggle id="totalEpicsDone" name="totalEpicsDone" isChecked={form.indexesVisibility.totalEpicsDone} onChange={handleIndexesVisibilityToggleChange} />
                <label htmlFor="'totalEpicsDone">Epics done</label>
              </div>
              <div>
                <Toggle id="totalTP" name="totalTP" isChecked={form.indexesVisibility.totalTP} onChange={handleIndexesVisibilityToggleChange} />
                <label htmlFor="'totalTP">Total issues done - TP total</label>
              </div>
              <div>
                <Toggle id="totalBugsDone" name="totalBugsDone" isChecked={form.indexesVisibility.totalBugsDone} onChange={handleIndexesVisibilityToggleChange} />
                <label htmlFor="totalBugsDone">Bugs resolvidos</label>
              </div>
              <div>
                <Toggle id="totalTasksDone" name="totalTasksDone" isChecked={form.indexesVisibility.totalTasksDone} onChange={handleIndexesVisibilityToggleChange} />
                <label htmlFor="totalTasksDone">Issues done</label>
              </div>
              <div>
                <Toggle id="totalBugsCreated" name="totalBugsCreated" isChecked={form.indexesVisibility.totalBugsCreated} onChange={handleIndexesVisibilityToggleChange} />
                <label htmlFor="totalBugsCreated">Bugs criados</label>
              </div>
              <div>
                <Toggle id="totalTasksStoriesDone" name="totalTasksStoriesDone" isChecked={form.indexesVisibility.totalTasksStoriesDone} onChange={handleIndexesVisibilityToggleChange} />
                <label htmlFor="totalTasksStoriesDone">Tasks & Stories done</label>
              </div>
              <div>
                <Toggle id="totalBugsNewImplementationCreated" name="totalBugsNewImplementationCreated" isChecked={form.indexesVisibility.totalBugsNewImplementationCreated} onChange={handleIndexesVisibilityToggleChange} />
                <label htmlFor="totalBugsNewImplementationCreated">Bugs criados NI (Features novas)</label>
              </div>
              <div>
                <Toggle id="totalStoriesDone" name="totalStoriesDone" isChecked={form.indexesVisibility.totalStoriesDone} onChange={handleIndexesVisibilityToggleChange} />
                <label htmlFor="totalStoriesDone">Stories done</label>
              </div>
              <div>
                <Toggle id="totalBugsN3Created" name="totalBugsN3Created" isChecked={form.indexesVisibility.totalBugsN3Created} onChange={handleIndexesVisibilityToggleChange} />
                <label htmlFor="totalBugsN3Created">Bugs criados em N3</label>
              </div>
              <div>
                <Toggle id="totalActionItensN3Created" name="totalActionItensN3Created" isChecked={form.indexesVisibility.totalActionItensN3Created} onChange={handleIndexesVisibilityToggleChange} />
                <label htmlFor="totalActionItensN3Created">Action Itens criados em N3</label>
              </div>
              <div>
                <Toggle id="totalStrategicTasksDone" name="totalStrategicTasksDone" isChecked={form.indexesVisibility.totalStrategicTasksDone} onChange={handleIndexesVisibilityToggleChange} />
                <label htmlFor="totalStrategicTasksDone">Issues done alinhadas com a estratégia</label>
              </div>
              <div>
                <Toggle id="totalNotStrategicTasksDone" name="totalNotStrategicTasksDone" isChecked={form.indexesVisibility.totalNotStrategicTasksDone} onChange={handleIndexesVisibilityToggleChange} />
                <label htmlFor="totalNotStrategicTasksDone">Issues done NÃO alinhadas com a estratégia</label>
              </div>
              <div>
                <Toggle id="strategicAlignment" name="strategicAlignment" isChecked={form.indexesVisibility.strategicAlignment} onChange={handleIndexesVisibilityToggleChange} />
                <label htmlFor="strategicAlignment">Alinhamento estratégico</label>
              </div>
              <div>
                <Toggle id="bugRate" name="bugRate" isChecked={form.indexesVisibility.bugRate} onChange={handleIndexesVisibilityToggleChange} />
                <label htmlFor="bugRate">Taxa de bugs</label>
              </div>
              <div>
                <Toggle id="totalSubTasksDone" name="totalSubTasksDone" isChecked={form.indexesVisibility.totalSubTasksDone} onChange={handleIndexesVisibilityToggleChange} />
                <label htmlFor="totalSubTasksDone">Sub-tasks done</label>
              </div>
              <div>
                <Toggle id="totalTechTasksDone" name="totalTechTasksDone" isChecked={form.indexesVisibility.totalTechTasksDone} onChange={handleIndexesVisibilityToggleChange} />
                <label htmlFor="totalTechTasksDone">Tech Tasks done</label>
              </div>
              <div>
                <Toggle id="n3TicketsCreated" name="n3TicketsCreated" isChecked={form.indexesVisibility.n3TicketsCreated} onChange={handleIndexesVisibilityToggleChange} />
                <label htmlFor="n3TicketsCreated">Chamados em N3</label>
              </div>
            </Grid>
            <FormFooter>
              <Button type="submit" appearance="primary">
                Salvar
              </Button>
            </FormFooter>
          </form>
        )}
      </Form>
    </div>
  );
};

export default Edit;