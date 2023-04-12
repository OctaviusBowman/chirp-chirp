
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime"

dayjs.extend(relativeTime)

import type { RouterOutputs } from "~/utils/api";
import Image from "next/image";
import Link from "next/link";



type PostWithUser = RouterOutputs["posts"]["getAll"][number]
export const PostView = (props: PostWithUser) => {
  const { post, author } = props;
  return (
    <div key={post.id} className="p-4 gap-3 border-b border-slate-400 flex">
      <Image src={author.profilePicture} className="w-14 h-14 rounded-full" width={56} height={56} alt={`@${author.username}'s profile picture`} />
      <div className="flex flex-col">
        <div className="flex text-slate-300 gap-1">
          <Link href={`/@${author.username}`}>
            <span>
              {`@${author.username}`}
            </span>
          </Link>
          <Link href={`/post/${post.id}`}>
            <span className="font-thin">
              {` • ${dayjs(post.createdAt).fromNow()}`}
            </span>
          </Link>
        </div>
        <span className="text-2xl">{post.content}</span>
      </div>
    </div>
  )
}