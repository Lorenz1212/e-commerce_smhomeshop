
export interface FeedbackModel {
  id:string
  rating: number
  comment: string
  author_name:string
  date_posted_format:string,
  sentiment_format:{
    title:string,
    color:string
  },
  source: {
    name:string
  }
}