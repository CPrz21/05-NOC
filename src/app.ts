import { envs } from './config/plugins/envs.plugin';

(() => {
  Main();
})();

function Main() {
  // Server.start();
  console.log(envs.PORT);
}
