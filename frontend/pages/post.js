import React from 'react'
import {CreateAndViewAsset} from "../components/videoupload"
import CreatePostModal from '../components/createpost'

const Post = () => {
  return (
    <div>
        <CreateAndViewAsset />
        <CreatePostModal/>
    </div>
  )
}

export default Post