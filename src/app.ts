import { envs } from './config/plugins/envs.plugin';
import { Server } from './presentation/server';

(() => {
  Main();
})();

function Main() {
  Server.start();
  console.log(envs.MAILER_EMAIL, envs.MAILER_SECRET_KEY);
}
