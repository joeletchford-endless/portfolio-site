import { RootLayout, handleServerFunctions } from '@payloadcms/next/layouts'
import { importMap } from './admin/importMap'
import config from '@payload-config'
import React from 'react'
import '@payloadcms/next/css'

type Args = {
  children: React.ReactNode
}

const serverFunction = async function (args: Parameters<typeof handleServerFunctions>[0]) {
  'use server'
  return handleServerFunctions({ ...args, config, importMap })
}

export default function PayloadLayout({ children }: Args) {
  return (
    <RootLayout config={config} importMap={importMap} serverFunction={serverFunction}>
      {children}
    </RootLayout>
  )
}
