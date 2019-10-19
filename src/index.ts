// tslint:disable:no-console
import config, { KnownConfigKey } from './utils/config';
config.init();

import { format } from 'util';
import app from './app';
import { connectDb } from './store/connection';

async function init() {
  await connectDb();

  const port = +config.get(KnownConfigKey.ServerPort, '3000');
  app.set('port', port);

  const server = app.listen(app.get('port'), () => {
    const address = format('http://localhost:%d', app.get('port'));
    console.log(
      '  App is running at %s in %s mode',
      address,
      app.get('env'),
    );
    console.log('  Press CTRL-C to stop\n');
  });
}

init()
  .catch(err => console.log('Error', err));
