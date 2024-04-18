import { readFileSync } from 'fs';
import { join } from 'path';
import * as yaml from 'js-yaml';
import { parse } from 'yaml';
import type { AppConfig } from '../src/types/config';

console.log(process.env.NODE_ENV);

// 配置文件名称
// const YAML_CONFIG_FILENAME = 'config.yaml';
const YAML_CONFIG_ENV = `config.${process.env.NODE_ENV || 'development'}.yaml`; // 这里名称与第五步对应起来

// path
// const commonConfig = yaml.load(
//   readFileSync(
//     join(__dirname, '../../src/config', YAML_CONFIG_FILENAME),
//     'utf-8',
//   ),
// ) as Record<string, any>;

const envConfig = readFileSync(
  join(__dirname, '../../', YAML_CONFIG_ENV),
  'utf-8',
);

// 合并文件
// export default () => {
//   return _.merge(commonConfig, envConfig);
// };
export function getConfig(): AppConfig {
  const config: AppConfig = parse(envConfig);
  return config;
}
