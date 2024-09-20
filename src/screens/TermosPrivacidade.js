import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; // Importa o CSS do Bootstrap
import 'bootstrap/dist/js/bootstrap.bundle.min.js'; // Importa o JS do Bootstrap
import capaMeetTea from '../img/capa_meet_tea.png'; // Certifique-se de que a imagem esteja na pasta correta

const TermosPrivacidade = () => {
  return (
    <div>
      <img src={capaMeetTea} alt="Capa Meet Tea" className="img-fluid" />
      <nav id="navbar-example2" className="navbar bg-body-tertiary px-3 mb-3">
        <a className="navbar-brand" href="#">Navegação</a>
        <ul className="nav nav-pills">
          <li className="nav-item">
            <a className="nav-link" href="#scrollspyHeading1">Políticas</a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="#scrollspyHeading2">Termos</a>
          </li>
          <li className="nav-item dropdown">
            <a className="nav-link dropdown-toggle" data-bs-toggle="dropdown" href="#" role="button" aria-expanded="false">Outros</a>
            <ul className="dropdown-menu">
              <li><a className="dropdown-item" href="#scrollspyHeading3">Licença</a></li>
              <li><a className="dropdown-item" href="#scrollspyHeading4">Responsabilidade</a></li>
              <li><a className="dropdown-item" href="#scrollspyHeading5">Limitações</a></li>
              <li><a className="dropdown-item" href="#scrollspyHeading6">Links</a></li>
              <li><a className="dropdown-item" href="#scrollspyHeading7">Modificações</a></li>
              <li><a className="dropdown-item" href="#scrollspyHeading8">Lei Aplicável</a></li>
            </ul>
          </li>
        </ul>
      </nav>
      <div data-bs-spy="scroll" data-bs-target="#navbar-example2" data-bs-root-margin="0px 0px -40%" data-bs-smooth-scroll="true" className="scrollspy-example bg-body-tertiary p-3 rounded-2" tabIndex="0">
        <div className="Politicas-de-privacidade">
          <h2 id="scrollspyHeading1">Políticas de Privacidade</h2>
          <p>A sua privacidade é importante para nós. É política do Meet Tea respeitar a sua privacidade em relação a qualquer informação sua que possamos coletar no site <a href="https://meet-tea-2-0.vercel.app/">Meet Tea</a>, e outros sites que possuímos e operamos.</p>
          <p>Solicitamos informações pessoais apenas quando realmente precisamos delas para lhe fornecer um serviço. Fazemo-lo por meios justos e legais, com o seu conhecimento e consentimento. Também informamos por que estamos coletando e como será usado.</p>
          <p>Apenas retemos as informações coletadas pelo tempo necessário para fornecer o serviço solicitado. Quando armazenamos dados, protegemos dentro de meios comercialmente aceitáveis ​​para evitar perdas e roubos, bem como acesso, divulgação, cópia, uso ou modificação não autorizados.</p>
          <p>Não compartilhamos informações de identificação pessoal publicamente ou com terceiros, exceto quando exigido por lei.</p>
          <p>O nosso site pode ter links para sites externos que não são operados por nós. Esteja ciente de que não temos controle sobre o conteúdo e práticas desses sites e não podemos aceitar responsabilidade por suas respectivas políticas de privacidade.</p>
          <p>Você é livre para recusar a nossa solicitação de informações pessoais, entendendo que talvez não possamos fornecer alguns dos serviços desejados.</p>
          <p>O uso continuado de nosso site será considerado como aceitação de nossas práticas em torno de privacidade e informações pessoais. Se você tiver alguma dúvida sobre como lidamos com dados do usuário e informações pessoais, entre em contato conosco.</p>
        </div>

        <div className="Compromisso-do-usuario">
          <h5>Compromisso do Usuário</h5>
          <p>O usuário se compromete a fazer uso adequado dos conteúdos e da informação que o Meet Tea oferece no site e com caráter enunciativo, mas não limitativo:</p>
          <ul>
            <li>A) Não se envolver em atividades que sejam ilegais ou contrárias à boa fé e à ordem pública.</li>
            <li>B) Não difundir propaganda ou conteúdo de natureza racista, xenofóbica, jogos de azar, qualquer tipo de pornografia ilegal, de apologia ao terrorismo ou contra os direitos humanos.</li>
            <li>C) Não causar danos aos sistemas lógicos (softwares) do Meet Tea, de seus fornecedores ou terceiros, para introduzir ou disseminar vírus informáticos ou quaisquer outros sistemas de hardware ou software que sejam capazes de causar danos anteriormente mencionados.</li>
          </ul>
        </div>

        <div className="Mais-informacoes">
          <h5>Mais informações</h5>
          <p>Esperemos que esteja esclarecido e, como mencionado anteriormente, se houver algo que você não tem certeza se precisa ou não, geralmente é mais seguro deixar os cookies ativados, caso interaja com um dos recursos que você usa em nosso site.</p>
          <p>Esta política é efetiva a partir de 10 Setembro 2024 02:54</p>
        </div>

        <div className="Termos">
          <h2 id="scrollspyHeading2">1. Termos</h2>
          <p>Ao acessar o site <a href="https://meet-tea-2-0.vercel.app/">Meet Tea</a>, você concorda em cumprir estes termos de serviço, todas as leis e regulamentos aplicáveis ​​e concorda que é responsável pelo cumprimento de todas as leis locais aplicáveis. Se você não concordar com algum desses termos, está proibido de usar ou acessar este site. Os materiais contidos neste site são protegidos pelas leis de direitos autorais e marcas comerciais aplicáveis.</p>
        </div>

        <h2 id="scrollspyHeading3">2. Uso de Licença</h2>
        <div className="Licenca">
          <p>É concedida permissão para baixar temporariamente uma cópia dos materiais (informações ou software) no site Meet Tea, apenas para visualização transitória pessoal e não comercial. Esta é a concessão de uma licença, não uma transferência de título e, sob esta licença, você não pode:</p>
          <ol>
            <li>Modificar ou copiar os materiais.</li>
            <li>Usar os materiais para qualquer finalidade comercial ou para exibição pública (comercial ou não comercial).</li>
            <li>Tentar descompilar ou fazer engenharia reversa de qualquer software contido no site Meet Tea.</li>
            <li>Remover quaisquer direitos autorais ou outras notações de propriedade dos materiais.</li>
            <li>Transferir os materiais para outra pessoa ou 'espelhe' os materiais em qualquer outro servidor.</li>
          </ol>
          <p>Esta licença será automaticamente rescindida se você violar alguma dessas restrições e poderá ser rescindida por Meet Tea a qualquer momento. Ao encerrar a visualização desses materiais ou após o término desta licença, você deve apagar todos os materiais baixados em sua posse, seja em formato eletrônico ou impresso.</p>
        </div>

        <h2 id="scrollspyHeading4">3. Isenção de responsabilidade</h2>
        <div className="Isencao-de-responsabilidade">
          <ol>
            <li>Os materiais no site da Meet Tea são fornecidos 'como estão'. Meet Tea não oferece garantias, expressas ou implícitas, e, por este meio, isenta e nega todas as outras garantias, incluindo, sem limitação, garantias implícitas ou condições de comercialização, adequação a um fim específico ou não violação de propriedade intelectual ou outra violação de direitos.</li>
            <li>Além disso, o Meet Tea não garante ou faz qualquer representação relativa à precisão, aos resultados prováveis ​​ou à confiabilidade do uso dos materiais em seu site ou de outra forma relacionado a esses materiais ou em sites vinculados a este site.</li>
          </ol>
        </div>

        <h2 id="scrollspyHeading5">4. Limitações</h2>
        <div className="Limitacoes">
          <p>Em nenhum caso o Meet Tea ou seus fornecedores serão responsáveis ​​por quaisquer danos (incluindo, sem limitação, danos por perda de dados ou lucro ou devido a interrupção dos negócios) decorrentes do uso ou da incapacidade de usar os materiais em Meet Tea, mesmo que Meet Tea ou um representante autorizado da Meet Tea tenha sido notificado oralmente ou por escrito da possibilidade de tais danos. Como algumas jurisdições não permitem limitações em garantias implícitas, ou limitações de responsabilidade por danos consequenciais ou incidentais, essas limitações podem não se aplicar a você.</p>
        </div>

        <h2 id="scrollspyHeading6">5. Links</h2>
        <div className="Links">
          <p>O Meet Tea não analisou todos os sites vinculados ao seu site e não é responsável pelo conteúdo de nenhum site vinculado. A inclusão de qualquer link não implica endosse por Meet Tea do site. O uso de qualquer site vinculado é por conta e risco do usuário.</p>
        </div>

        <h4 id="scrollspyHeading7">Modificações</h4>
        <div className="Modificacoes">
          <p>O Meet Tea pode revisar estes termos de serviço do site a qualquer momento, sem aviso prévio. Todas as atualizações futuras serão avisadas pelo e-mail cadastrado, sendo válidas de sua concordância. Ao usar este site, você concorda em ficar vinculado à versão atual desses termos de serviço.</p>
        </div>

        <h4 id="scrollspyHeading8">Lei aplicável</h4>
        <div className="Lei-aplicavel">
          <p>Estes termos e condições são regidos e interpretados de acordo com as leis do Meet Tea e você se submete irrevogavelmente à jurisdição exclusiva dos tribunais naquele estado ou localidade.</p>
        </div>
      </div>
    </div>
  );
};


export default TermosPrivacidade;
