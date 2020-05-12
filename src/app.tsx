import { hot, setConfig } from 'react-hot-loader';
import Main from './page';

setConfig({
  logLevel: 'debug',
  reloadHooks: false,
  pureSFC: true,
  pureRender: true,
 });

export default hot(module)(Main);
