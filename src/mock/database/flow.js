import types from 'redux/modules/flowType'

export default {
  [types.query]: function () {
    return [{
      'name': 'flow',
      'createdAt': 1502418628,
      'updatedAt': 1502418628,
      env: {
        FLOW_GIT_WEBHOOK: 'http://hooks.flow.ci/11ae50e2a9cbdfc8/eb8d1f8d05a4ff24d9760ca387b84a59',
      },
    }, {
      'name': 'flow-a',
      'createdAt': 1502691673,
      'updatedAt': 1502691686,
      env: {
        FLOW_GIT_WEBHOOK: 'http://hooks.flow.ci/11ae50e2a9cbdfc8/eb8d1f8d05a4ff24d9760ca387b84a59',
      },
    }, {
      'name': 'flow-test',
      'createdAt': 1502691156,
      'updatedAt': 1502691269,
      env: {
        FLOW_GIT_WEBHOOK: 'http://hooks.flow.ci/11ae50e2a9cbdfc8/eb8d1f8d05a4ff24d9760ca387b84a59',
      },
    }]
  },
  [types.get]: function ({ params: { flowName } }) {
    return {
      'name': flowName,
      'createdAt': 1502418628,
      'updatedAt': 1502418628,
      env: {
        FLOW_GIT_WEBHOOK: 'http://hooks.flow.ci/11ae50e2a9cbdfc8/eb8d1f8d05a4ff24d9760ca387b84a59',
      },
    }
  },
  [types.create]: function ({ params: { flowName } }) {
    return {
      name: flowName,
      'createdAt': (new Date().getTime()) / 1000,
      'updatedAt': 1502418628,
      env: {
        FLOW_GIT_WEBHOOK: 'http://hooks.flow.ci/11ae50e2a9cbdfc8/eb8d1f8d05a4ff24d9760ca387b84a59',
      },
    }
  }
}
