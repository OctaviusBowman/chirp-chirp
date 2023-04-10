import type { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import { api } from "~/utils/api";


const ProfilePage: NextPage<{username: string}>  = ({username}) => {

    const { data } = api.profile.getUserByUsername.useQuery({
        username
    })

    if (!data) return <div>404</div>

    console.log(username)

    return (
        <>
            <Head>
                <title>{data.username}</title>
            </Head>
            <PageLayout>
                <div className="border-slate-400 bg-slate-600 h-36 relative">
                    <Image 
                    src={data.profilePicture} 
                    alt={`${data.username ?? ""}'s profile picture`} 
                    width={120} 
                    height={120}
                    className="-mb-16 absolute bottom-0 left-0 ml-4 rounded-full border-4 border-black bg-black"
                    />
                </div>
                <div className="h-[64px]"></div>
                <div className="p-4 text-2xl font-bold">{`@${data.username ?? ""}`}</div>
                <div className="border-b border-slate-400 w-full"></div>
            </PageLayout>
        </>
    );
};

import { createProxySSGHelpers } from '@trpc/react-query/ssg';
// import { createServerSideHelpers } from '@trpc/react-query/server';
import { appRouter } from "~/server/api/root";
import { prisma } from "~/server/db";
import SuperJSON from "superjson";
import { PageLayout } from "~/components/layout";
import Image from "next/image";


export const getStaticProps: GetStaticProps = async (context) => {
    const ssg = createProxySSGHelpers({
        router: appRouter,
        ctx: { prisma, userId: null },
        transformer: SuperJSON, // optional - adds superjson serialization
      });

      const slug = context.params?.slug

      if (typeof slug !== "string") throw new Error("no slug")

      const username = slug.replace("@", "")

      await ssg.profile.getUserByUsername.prefetch({username})

      return {
        props: {
            trpcState: ssg.dehydrate(),
            username
        }
      }
}

export const getStaticPaths = () => {
    return {paths: [], fallback: "blocking"}
}

export default ProfilePage;