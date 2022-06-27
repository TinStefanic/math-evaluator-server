import { config } from './configuration/config';
import app from './index';

app.listen(config.port);
console.log(`Listening on port ${config.port}.`);