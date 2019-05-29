export interface Items{
    id: string;
    volumeInfo: VolumeInfo;
    saleInfo: SaleInfo;
    accessInfo: AccessInfo;
}
interface VolumeInfo {
    title: string;
    authors: string[];
    publisher: string;
    publishedDate: string;
    description: string;
    industryIdentifiers: IndustryIdentifiersItem[];
    categories: string[];
    averageRating: number;
    ratingsCount: number;
    imageLinks: ImageLinks;
    language: string;
    previewLink: string;
    infoLink: string;
}
interface IndustryIdentifiersItem {
    type: string;
    identifier: string;
}
interface ImageLinks {
    smallThumbnail: string;
    thumbnail: string;
}
interface SaleInfo {
    isEbook: boolean;
    retailPrice: RetailPrice;
    buyLink: string;
}
interface RetailPrice {
    amount?: number;
    currencyCode: string;
    amountInMicros?: number;
}
interface AccessInfo {
    country: string;
    embeddable: boolean;
    epub: Epub;
    pdf: Pdf;
    webReaderLink: string;
}
interface Epub {
    isAvailable: boolean;
    acsTokenLink: string;
}
interface Pdf {
    isAvailable: boolean;
    acsTokenLink: string;
}
