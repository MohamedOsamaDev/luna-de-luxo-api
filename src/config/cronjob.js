import { cleanCanceledOrders } from "../modules/order/services/order.cronjob.js";

export let scheduleTasks = [
  {
    task: cleanCanceledOrders,
    interval: "*/4 * * * *",
    name: "clean canceled orders",
  },
];
