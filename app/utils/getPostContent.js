import fs from 'fs'
import matter from "gray-matter"
import path from 'path'

export default function getPostContent(slug) {
    const folder = path.join(process.cwd(), "app/posts/")
    const file = folder + `${slug}.md`
    const content = fs.readFileSync(file, 'utf8')

    const matterResult = matter(content)
    return matterResult
}