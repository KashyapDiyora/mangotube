import {useState,useEffect} from 'react';
import Image from 'next/image';
import { Loader2 } from 'lucide-react';

function Comment({userId,videoId,userImage}) {

    const [comments,setComments] = useState([]);
    const [newComment,setNewComment] = useState("");
    const [commentPostLoading,setCommentPostLoading] = useState(false);

    const fetchComment = async() => {
      const res = await fetch("/api/get-comment/",{
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body : JSON.stringify({
              userId,
              videoId
          })
      });

      const data = await res.json();
      if(data?.comments){
          setComments(data.comments);
      }
    }
    useEffect(() => {
        if(userId && videoId){
            fetchComment();
        }
    }, [userId,videoId]);

    async function handlePost(e) {
        setCommentPostLoading(true);
        e.preventDefault();
        if(!newComment) return;
        const res = await fetch("/api/post-comment/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                commentMessage: newComment,
                videoId,
                userId,
            })
        });
        const data = await res.json();
        setCommentPostLoading(false);
        if(data?.comment) {
            // setComments((prev) => [...prev, data.comment]);
            await fetchComment();
            setNewComment("");
        }
    }

    if(commentPostLoading){
      return (
        <div>
          <Loader2 className="w-6 h-6 animate-spin text-gray-500" />
        </div>
      )
    }

  return (
    <div className="md:p-2 lg:p-4 mt-2">
      {/* Add comment */}
      <div className="flex gap-4 mb-6">
        <Image src={userImage} width={10} height={10} alt='avatar' className='w-8 h-8 rounded-full object-cover' />
        <div className="flex w-full justify-center gap-x-1">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            className="w-full p-2 border border-gray-300 rounded-md mb-1 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={1}
          />
          <div className="">
            <button
              onClick={handlePost}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            >
              Comment
            </button>
          </div>
        </div>
      </div>

      {/* Comment list */}
      <div className="space-y-6">
        {comments.map((comment) => (
          <div key={comment._id} className="flex items-center gap-4">
            {comment.owner.avatar && (
              <Image src={comment.owner.avatar} width={10} height={10} alt='avatar' className="w-6 h-6 rounded-full object-cover" />
            )}
            <div>
              <p className="font-semibold">
                {comment.owner.username}
                <span className="text-sm text-gray-500 ml-2">
                  {comment.createdAt}
                </span>
              </p>
              <p className="text-sm">{comment.commentMessage}</p>
              {/* You can enable likes/replies here later */}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Comment;