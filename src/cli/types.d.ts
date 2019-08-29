declare module 'mirror-config-china/lib/config' {
  function getConf (argv: string[]): { [key: string]: string }
  export = getConf
}
