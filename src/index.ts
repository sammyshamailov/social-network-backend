import { app } from './app';
import { init } from './store/index';
import { getConfig } from './utils/config';

const port = +(getConfig('PORT', 3000));
app.set('port', port);

const server = app.listen(app.get('port'), () => {
  console.log(
    ' App is running at http://localhost:%d in %s mode',
    app.get('port'),
    app.get('env'),
  );
  console.log(' Press CTRL-C to stop\n');
});

init();
