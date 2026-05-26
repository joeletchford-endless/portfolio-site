import { NotFoundPage } from '@payloadcms/next/views'
import { importMap } from '../importMap'
import config from '@payload-config'

const NotFound = () => NotFoundPage({ config, importMap })
export default NotFound
