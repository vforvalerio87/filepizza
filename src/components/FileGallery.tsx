import FileGalleryItem from "./FileGalleryItem";

export default function FileGallery({ files }) {
  return (
    <div className="gallery">
      {files.map(f => (
        <FileGalleryItem key={f.name} file={f} />
      ))}
    </div>
  );
}
