import cancel from 'index'
import create from 'middleware'
import isCancel from 'isCancel'

const middleware = create()
function noop () {}
function getState () {
  return {}
}
describe('Redux Middleware test', function () {
  let _fakeServer

  function getRequest (index) {
    const { requests } = _fakeServer
    return requests[index]
  }

  beforeEach(() => {
    _fakeServer = sinon.fakeServer.create()
    _fakeServer.respond([200, {
        'Content-Type': 'application/json; charset=utf-8'
      }, JSON.stringify({ message: 'this is default response' })])
    _fakeServer.autoRespond = true
  })

  afterEach(() => {
    _fakeServer.restore()
  })

  it('should export an middleware function', function () {
    const nextfn = middleware({ dispatch: noop, getState })
    expect(nextfn).to.be.a('function')
    const actionfn = nextfn(noop)
    expect(actionfn).to.be.a('function')
  })

  it('should return next(action) when action is not matched', function () {
    function next () {
      return 'this is next result'
    }

    const result = middleware({ dispatch: noop, getState })(next)({
      type: 'sometype'
    })
    expect(result).to.be.eql('this is next result')

    const middle = create({ type: '@@http/SEND' })
    const hasTypeResult = middle({ dispatch: noop, getState })(next)({
      type: 'sometype',
      url: '/somepath'
    })
    expect(hasTypeResult).to.be.eql('this is next result')

  })

  it('should no call next(action) when action is matched', function () {
    const next = sinon.spy()
    const handler = middleware({ dispatch: noop, getState })(next)
    const result = handler({ url: '/somepath' })
    next.should.have.not.been.called
  })

  describe('middleware config', function () {
    it('extends config option from axios', async function () {
      const middle = create({ baseURL: 'http://api.domain.com' })
      const actionHandler = middle({ dispatch: noop, getState })(noop)
      await actionHandler({
        url: '/somepath'
      })
      const request = getRequest(0)
      const { url } = request
      expect(url).to.equal('http://api.domain.com/somepath')
    })

    describe('match middleware', function () {
      it('should match all has url action if not set config.type', function () {
        const middle = create({})
        const actionHandler = middle({ dispatch: noop, getState })(noop)

        const p = actionHandler({
          url: '/somepath'
        })
        expect(p).to.be.a('promise')

        const p2 = actionHandler({
          url: '/somepath',
          type: 'someType'
        })
        expect(p2).to.be.a('promise')
      })

      it('should only match action.type is config.type and has action.url when set config.type', async function () {
        const middle = create({
          type: '@@http/SEND',
        })

        const actionHandler = middle({ dispatch: noop, getState })(noop)
        const p = actionHandler({
          url: '/somepath'
        })
        expect(p).to.be.undefined // not matched

        const p2 = actionHandler({
          url: '/otherpath',
          type: '@@http/SEND',
        })
        expect(p2).to.be.a('promise')
      })
    })
  })

  describe('handle action', function () {
    const actionHandler = middleware({ dispatch: noop, getState })(noop)
    it ('should return an promise when action is matched', function () {
      const result = actionHandler({ url: '/somepath' })
      expect(result).to.be.a('promise')
    })

    it ('result must can cancel', function () {
      _fakeServer.autoRespondAfter = 10000

      const dispatch = sinon.spy()
      const handler = middleware({ dispatch, getState })(noop)
      const promise = handler({ url: '/sompath', name: 'getSomeThing' })

      const p2 = promsie.catch((e) => {
        expect(isCancel(e)).to.be.true
        return Promise.reject(e)
      })

      setTimeout(() => {
        cancel(promise)
      }, 100)
      return p2.should.be.rejected
    })

    describe('disptach indicator action', function () {
      let _dispatch
      let _handler
      beforeEach(() => {
        _dispatch = sinon.spy()
        _handler = middleware({ dispatch, getState })(noop)
      })

      it('should sync dispatch action with { type: ${name}/SEND } before send http request', function () {
        _handler({ url: '/sompath', name: 'getSomeThing' })
        _dispatch.should.have.been.calledWithMatch({ type: 'getSomeThing/SEND' })
      })

      it('should dispatch { type: ${name}/SUCCESS } on success', async function () {
        await _handler({ url: '/sompath', name: 'getSomeThing' })
        _dispatch.should.have.been.calledWithMatch({
          type: 'getSomeThing/SUCCESS'
        })
      })

      it('should dispatch { type: ${name}/FAILURE } on failure', async function () {

        _fakeServer.respond([400, {
          'Content-Type': 'application/json; charset=utf-8'
        }, JSON.stringify({ message: 'this is default response' })])

        try{
          await _handler({ url: '/sompath', name: 'getSomeThing' })
          expect(false).to.be.true // must not go here
        } catch(e) {
          _dispatch.should.have.been.calledWithMatch({
            type: 'getSomeThing/FAILURE'
          })
        }
      })

      it('should dispatch { type: ${name}/CANCEL } on cancel', async function () {
        _fakeServer.autoRespondAfter = 10000

        const handler = middleware({ dispatch, getState })(noop)
        const promise = handler({ url: '/sompath', name: 'getSomeThing' })

        const p2 = promsie.catch((e) => {
          expect(isCancel(e)).to.be.true
          return Promise.reject(e)
        })

        cancel(promise)

        setTimeout(() => {
          // wait p2 call catch method
          _dispatch.should.have.been.calledWithMatch({
            type: 'getSomeThing/FAILURE'
          })
        }, 100)
        return p2.should.be.rejected
      })
    })
  })
})