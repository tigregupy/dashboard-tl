import React, { useRef } from 'react';

import Button from '@atlaskit/button/standard-button';
import { Code } from '@atlaskit/code';
import Modal, {
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalTitle,
  ModalTransition,
} from '@atlaskit/modal-dialog';
import SectionMessage from '@atlaskit/section-message';

const InfoModal = ({ isOpen, closeModal }) => {
  const focusRef = useRef();

  return (
    <>
      <ModalTransition>
        {isOpen && (
          <Modal
            onClose={closeModal}
            height={600}
            width="large"
            autoFocus={focusRef}
          >
            <ModalHeader>
              <ModalTitle>Como as informações são obtidas e/ou calculadas?</ModalTitle>
            </ModalHeader>
            <ModalBody>
              <SectionMessage>
                <p>Oi! Esse plugin foi desenvolvido pelo <Code>@nando</Code> e adaptado por <Code>@Gabriela Santos</Code> e <Code>@Gabriela Martins</Code>.  Qualquer dúvida é só enviar mensagem no Slack 😉</p>
              </SectionMessage>

              <h4>Epics done</h4>
              <p>
                &#9642; Todas as tarefas do tipo <Code>Epic</Code> que foram <b>finalizadas</b> dentro do período.
              </p>

              <h4>Stories done</h4>
              <p>
                &#9642; Todas as tarefas do tipo <Code>Story</Code> que foram <b>finalizadas</b> dentro do período.
              </p>

              <h4>Throughput</h4>
              <p>
                &#9642;Throughput são todas as tarefas do tipo <Code>Sub-Tasks, Tech Tasks, Spikes, Bugs</Code> que foram <b>finalizadas</b> dentro período. Mede a vazão (capacidade) de entrega do time.
              </p>

              <h4>Subtasks done</h4>
              <p>
                &#9642;Todas as tarefas do tipo <Code>Sub-Task</Code> que foram <b>finalizadas</b> dentro período.
              </p>

              <h4>Stories done alinhadas com a estratégia</h4>
              <p>
                &#9642;Todas as Histórias que foram <b>finalizadas</b> dentro período e que:
                <ul>
                  <li>perteçam à um Epic;</li>
                  <li>o Epic esteja vinculado à uma iniciativa no <a target="_blank" href="https://gupy-io.atlassian.net/jira/polaris/projects/INI/ideas/view/2854855">Portifólio de iniciativas</a>;</li>
                  <li>o campo "Roteiro" da inciativa esteja preenchido com o quarter que seja relacionado ao período;</li>        
                </ul>
              </p>

              <h4>Stories done <b>NÃO</b> alinhadas com a estratégia</h4>
              <p>
                &#9642;Todas as Histórias que foram <b>finalizadas</b> dentro período e que:
                <ul>
                  <li><b>NÃO</b> perteçam à um épico;</li>
                  <li>perteçam à um épico, mas que o épico <b>NÃO</b> esteja vinculado à uma iniciativa no <a target="_blank" href="https://gupy-io.atlassian.net/jira/polaris/projects/INI/ideas/view/2854855">Portifólio de iniciativas</a>;</li>
                  <li>perteçam à um épico que esteja vinculada à uma iniciativa, mas que o campo "Roteiro" da inciativa <b>NÃO</b> esteja preenchido com o quarter que seja relacionado ao período;</li>
                  <li><b>SEJAM</b> dos tipos: <Code>Bug</Code> ou <Code>Issue</Code>.</li>
                </ul>
              </p>

              <h4>Alinhamento estratégico</h4>
              <p>
                &#9642;Total de <b>Stories done alinhadas com a estratégia</b> dividido pelo total de <b>Stories done</b> vezes 100.
              </p>
              <p>
                Representa quanto do trabalho entregue do time está relacionado à estratégia definida no semestre.
              </p>

              <h4>Total de Bugs criados</h4>
              <p>
                &#9642;Todas as tarefas do tipo <Code>Bug</Code> ou <Code>Issue</Code> que foram <b>criadas</b> dentro do período, seja no board do time ou em N3.
              </p>

              <h4>Bugs done</h4>
              <p>
                &#9642;Todas as tarefas do tipo <Code>Bug</Code> ou <Code>Issue</Code> que foram <b>finalizadas</b> dentro do período.
              </p>

              <h4>Bugs criados em N3</h4>
              <p>
                &#9642;Todas as tarefas do tipo <Code>Bug</Code> ou <Code>Issue</Code> que foram <b>criadas</b> em N3 dentro do período.
              </p>

              <h4>Bugs criados NI (New Implementation)</h4>
              <p>
                &#9642;Todas as tarefas que foram <b>criadas</b> dentro do período e que:
                <ul>
                  <li>sejam do tipo <Code>Bug</Code> ou <Code>Issue</Code>;</li>
                  <li>o campo "Bug Origin" do cartão esteja preenchido com o valor <Code>New Implementation</Code>.</li>
                </ul>
              </p>
              <p>
                Representa bugs gerados a partir de funcionalidades lançadas recentemente, como no semestre atual.
              </p>

              <h4>Bugs criados LS (Legacy Structure)</h4>
              <p>
                &#9642;Todas as tarefas que foram <b>criadas</b> dentro do período e que:
                <ul>
                  <li>sejam do tipo <Code>Bug</Code> ou <Code>Issue</Code>;</li>
                  <li>que o campo "Bug Origin" do cartão esteja preenchido com o valor <Code>Legacy Structure</Code>.</li>
                </ul>
              </p>
              <p>
                Representa bugs gerados em funcionalidades antigas que foram lançadas há muito tempo, como 2, 3 anos atrás, com pouca documentação e/ou pouco conhecimento do time.
              </p>

              <h4>Bugs criados SF (Stable Feature)</h4>
              <p>
                &#9642;Todas as tarefas que foram <b>criadas</b> dentro do período e que:
                <ul>
                  <li>sejam do tipo <Code>Bug</Code> ou <Code>Issue</Code>;</li>
                  <li>o campo "Bug Origin" do cartão esteja preenchido com o valor <Code>Stable Feature</Code>.</li>
                </ul>
              </p>
              <p>
                Representa bugs gerados em funcionalidades estáveis que foram lançadas há pouco tempo, como no semestre ou ano anterior.
              </p>

              <h4>Incidentes (P0)</h4>
              <p>
                <p>
                  &#9642;Todas as tarefas que foram <b>criadas</b> dentro do período e que:
                  <ul>
                    <li>sejam do tipo <Code>Bug</Code> ou <Code>Issue</Code>;</li>
                    <li>o campo "Criticidade" do cartão esteja preenchido com o valor <Code>P0</Code>.</li>
                  </ul>
                </p>
              </p>

              <h4>Taxa de bugs</h4>
              <p>
                &#9642;Total de <b>Bugs criados</b> dividido pelo <b>Throughput</b> vezes 100.
              </p>
              <p>
                Representa a densidade de defeitos, ou seja, quantos bugs um time cria em relação ao total de tarefas que entrega. Quanto maior a porcentagem, menor a qualidade.
              </p>

              <h4>Média bugs criados/mês</h4>
              <p>
                &#9642;Total de <b>Bugs criados</b> dividido pelo total de meses dentro do período selecionado, vezes 100.
              </p>
              
              <h4>Chamados criados em N3</h4>
              <p>
                &#9642;Total de <b>tarefas</b> criadas no <a target="_blank" href="https://gupy-io.atlassian.net/jira/software/c/projects/NE/boards/408">Quadro N3 EduCorp</a>.
              </p>

            </ModalBody>
            <ModalFooter>
              <Button appearance="primary" onClick={closeModal}>
                Entendi
              </Button>
            </ModalFooter>
          </Modal>
        )}
      </ModalTransition>
    </>
  );
};

export default InfoModal;