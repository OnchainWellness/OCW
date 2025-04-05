import Home from "@/app/components/Home/Home";

export const dynamicParams = false

export async function generateStaticParams() {
    const pages = [{id: 'lo0m1pa2k'}]
    return pages
}

export default function Page({params}: {params: {id: string}}) {
    console.log(params.id);
    return (
        <div className="mb-36">
            <main>
                <Home />
            </main>
        </div>
    )
}
