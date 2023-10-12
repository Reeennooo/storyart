export type FooterLinksPathType =
  | '/info/terms'
  | '/info/policy'
  | '/info/license'
  | '/info/contacts'
  | '/'

export interface IFooterLinks {
  id: number
  title?: string
  icon?: string
  path?: FooterLinksPathType
}
