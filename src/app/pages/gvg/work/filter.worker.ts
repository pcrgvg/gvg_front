/// <reference lib="webworker" />
import { filterTask } from '../util/filterTask';

addEventListener('message', ({ data }) => {
  const res = filterTask(data);
  postMessage(res);
});
