import 'dotenv/config';
import { MainComponent } from './app/main/main.js';

const main = new MainComponent();
main.start().catch((error) => {
  console.error('[GoDirect] fatal startup error', error);
  process.exit(1);
});
