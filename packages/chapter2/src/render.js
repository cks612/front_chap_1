export function jsx(type, props, ...children) {
  return { type, props, children };
}

export function createElement(node) {
  // jsx를 dom으로 변환
  // 노드가 문자열이 아닌 경우
  // 1. 엘리먼트를 생성합니다.

  // const $el = document.createElement(node.type);
  if (typeof node === "string") {
    return document.createTextNode(node);
  }

  const $el = document.createElement(node.type);
  console.log($el); // node.type으로 노드에 타입을 가져와서 element 생성

  // 노드의 자식들을 $el child로 추가
  node.children.forEach((child) => $el.appendChild(createElement(child)));

  return $el;
}

function updateAttributes(target, newProps, oldProps) {
  // newProps들을 반복하여 각 속성과 값을 확인
  //   만약 oldProps에 같은 속성이 있고 값이 동일하다면
  //     다음 속성으로 넘어감 (변경 불필요)
  //   만약 위 조건에 해당하지 않는다면 (속성값이 다르거나 구속성에 없음)
  //     target에 해당 속성을 새 값으로 설정
  // oldProps을 반복하여 각 속성 확인
  //   만약 newProps들에 해당 속성이 존재한다면
  //     다음 속성으로 넘어감 (속성 유지 필요)
  for (const [name, value] of Object.entries(newProps)) {
    if (oldProps[name] !== newProps[name]) target.setAttribute(name, value);
  }

  //   만약 newProps들에 해당 속성이 존재하지 않는다면
  //     target에서 해당 속성을 제거
  for (const name of Object.keys(oldProps)) {
    if (newProps[name] === undefined) target.removeAttribute(name);
  }
}

function isNodeDiff(node1, node2) {
  return (
    (typeof node1 === "string" &&
      typeof node1 === "string" &&
      node1 !== node2) ||
    node1.type !== node2.type
  );
}

function getLongLength(newNodeChildren, oldNodeChildren) {
  return newNodeChildren.length > oldNodeChildren.length
    ? newNodeChildren.length
    : oldNodeChildren.length;
}

export function render(parent, newNode, oldNode, index = 0) {
  // 1. 만약 newNode가 없고 oldNode만 있다면
  //   parent에서 oldNode를 제거
  //   종료
  // 2. 만약 newNode가 있고 oldNode가 없다면
  //   newNode를 생성하여 parent에 추가
  //   종료
  // 3. 만약 newNode와 oldNode 둘 다 문자열이고 서로 다르다면
  //   oldNode를 newNode로 교체
  //   종료
  // 4. 만약 newNode와 oldNode의 타입이 다르다면
  //   oldNode를 newNode로 교체
  //   종료
  // 5. newNode와 oldNode에 대해 updateAttributes 실행
  // 6. newNode와 oldNode 자식노드들 중 더 긴 길이를 가진 것을 기준으로 반복
  //   각 자식노드에 대해 재귀적으로 render 함수 호출
  if (!newNode && oldNode) parent.removeChild(parent.childNodes[index]);
  else if (newNode && !oldNode) parent.appendChild(createElement(newNode));
  else if (isNodeDiff(newNode, oldNode))
    parent.replaceChild(createElement(newNode), parent.childNodes[index]);
  else if (newNode.type) {
    const getMaxLength = getLongLength(newNode.children, oldNode.children);
    for (let i = 0; i < getMaxLength; i++) {
      render(
        parent.childNodes[index],
        newNode.children[i],
        oldNode.children[i],
        i
      );
    }
  }
  updateAttributes(
    parent.childNodes[index],
    newNode?.props || {},
    oldNode?.props || {}
  );
}
