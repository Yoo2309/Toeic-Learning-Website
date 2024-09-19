import React from 'react'
import TestList from './TestList'
import TestHome from "../Home/TestHome/TestHome"

function TestIndex() {
  return (
    <div className='test-index-wrapper'>
      <TestList testType={"FullTest"}/>
      <TestList testType={"MiniTest"}/>
      <TestHome subtitle="" title="Thực hiện các bài thi TOEIC"/>
    </div>
  )
}

export default TestIndex
