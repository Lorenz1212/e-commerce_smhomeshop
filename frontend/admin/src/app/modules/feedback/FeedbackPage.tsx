import {Route, Routes, Outlet, Navigate} from 'react-router-dom'
import {PageLink, PageTitle} from '@/layout/core'
import {FeedbackList} from './components/feedbackList'

const Breadcrumbs: Array<PageLink> = [
  {
    title: 'Feedbacks',
    path: '/feedback/list',
    isSeparator: false,
    isActive: false,
  },

]

const FeedbackPage = () => {
  return (
    <>
      <PageTitle breadcrumbs={Breadcrumbs}></PageTitle>
      <FeedbackList title={'Feedback'}/>
    </>
  )
}

export default FeedbackPage
