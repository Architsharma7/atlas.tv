import React from 'react'
import {CreateAndViewAsset} from "../components/videoupload"
import CreatePostModal from '../components/post'

const Post = () => {
  return (
    <div>
        <CreateAndViewAsset />
        <CreatePostModal/>
    </div>
  )
}

export default Post