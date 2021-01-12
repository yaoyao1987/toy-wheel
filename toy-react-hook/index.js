let isMount = true;
let workInProgressHook = null;

const fiber = {
  stateNode: App,
  memoizedState: null
}

function useState(initialState) {
  let hook;

  if (isMount) {
    // mount时为该useState生成hook
    hook = {
      queue: {
        pending: null
      },
      memoizedState: initialState,
      next: null
    }
    // 将hook插入fiber.memoizedState链表末尾
    if (!fiber.memoizedState) {
      fiber.memoizedState = hook;
    } else {
      workInProgressHook.next = hook
    }
    workInProgressHook = hook;
  } else {
    hook = workInProgressHook;
    workInProgressHook = workInProgressHook.next;
  }

  let baseState = hook.memoizedState;

  if (hook.queue.pending) {
    let firstUpdate = hook.queue.pending.next;

    do {
      const action = firstUpdate.action;
      baseState = action(baseState);
      firstUpdate = firstUpdate.next;
    } while (firstUpdate !== hook.queue.pending.next)

    hook.queue.pending = null;
  }

  hook.memoizedState = baseState;
  return [baseState, dispatchAction.bind(null, hook.queue)]
}

function dispatchAction(queue, action) {
  const update = {
    action,
    next: null
  }

  if (queue.pending === null) {
    // u0->u0->u0,环状链表
    update.next = update;
  } else {
    // u1->u0->u1
    update.next = queue.pending.next
    queue.pending.next = update
  }

  queue.pending = update
  // 模拟React开始调度更新
  schedule()
}

function schedule() {
  // 更新前将workInProgressHook重置为fiber保存的第一个Hook
  workInProgressHook = fiber.memoizedState
  // 触发组件render
  const app = fiber.stateNode()
  // 组件首次render为mount，以后再触发的更新为update
  isMount = false;
  return app;
}

function App() {
  const [num, updateNum] = useState(0)

  console.log('isMount?', isMount)
  console.log('num:', num)

  return {
    onClick() {
      updateNum(num => num + 1)
    }
  }
}

window.app = schedule()