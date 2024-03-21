export function createHooks(callback) {
  let idx = 0;
  let stateObj = {};
  const cacheValue = {};

  const useState = (initState) => {
    const currIdx = idx;

    // 초기값 설정
    if (!stateObj.hasOwnProperty(currIdx)) {
      stateObj[currIdx] = initState;
    }

    // 상태 할당
    const state = stateObj[currIdx];

    const setState = (newState) => {
      // 새로운 상태를 객체에 할당
      stateObj[currIdx] = newState;
      callback();
    };

    // 실행된 횟수를 1 증가시켜 다음 값으로 push 할 수 있게 함
    idx++;
    return [state, setState];
  };

  const useMemo = (fn, refs) => {
    // 인자로 받은 deps 배열을 문자열로 변환하여 캐시 키로 사용
    const key = JSON.stringify(refs);

    console.log(cacheValue);
    // 만약 cacheValue 저장된 결과가 있다면 이를 반환
    if (key in cacheValue) {
      return cacheValue[key];
    }

    // cacheValue 저장된 결과가 없다면 새로운 결과를 계산하고 캐시에 저장한 후 반환
    const result = fn();
    cacheValue[key] = result;
    return result;
  };

  // or useMemo 함수 객체의 프로퍼티인 .cache 객체 사용
  // const useMemo = (fn, refs) => {
  //   // 캐시 객체 생성
  //   useMemo.cache = useMemo.cache || {};

  //   // 인자로 받은 deps 배열을 문자열로 변환하여 캐시 키로 사용
  //   const key = JSON.stringify(refs);

  //   // // 만약 캐시에 저장된 결과가 있다면 이를 반환
  //   if (key in useMemo.cache) {
  //     return useMemo.cache[key];
  //   }
  //   const result = fn();
  //   cacheValue[key] = result;
  //   useMemo.cache[key] = result;
  //   return result;
  // };

  const resetContext = () => {
    // idx 값 초기화
    idx = 0;
  };

  return { useState, useMemo, resetContext };
}
