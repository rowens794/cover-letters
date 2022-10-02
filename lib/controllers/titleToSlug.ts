export default function titleToSlug(title: string): string {
  //convert a title to a slug
  const slug = title
    .toLowerCase()
    .replace(/ /g, "-")
    .replace(/[^\w-]+/g, "");

  return slug;
}
