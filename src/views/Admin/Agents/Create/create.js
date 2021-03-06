import React, { Component } from 'react'
import PropTypes from 'prop-types'

import i18n from '../i18n'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { push } from 'react-router-redux'
import { actions } from 'redux/modules/agent'

import Form from './form'

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    create: actions.create,
    redirect: push,
  }, dispatch)
}

export class CreateAgent extends Component {
  static propTypes = {
    create: PropTypes.func.isRequired,
    redirect: PropTypes.func.isRequired,
    i18n: PropTypes.func.isRequired,
  }

  static defaultProps = {
    i18n: i18n.createChild('create'),
  }

  handleSbumit = (values) => {
    const { create, redirect } = this.props
    const { zone, name } = values
    return create(zone, name).then(() => {
      redirect('/admin/agents')
    })
  }

  render () {
    const { i18n } = this.props
    return <Form onSubmit={this.handleSbumit} i18n={i18n} />
  }
}

export default connect(undefined, mapDispatchToProps)(CreateAgent)
