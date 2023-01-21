export const delay = async (time: number) =>
  new Promise((resolve, reject) => setTimeout(resolve, time));
