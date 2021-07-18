/// <reference lib="webworker" />
import { filterTask } from '../services/filterTask';

addEventListener('message', ({ data }) => {
  const res = filterTask(data);
  postMessage(res);
});