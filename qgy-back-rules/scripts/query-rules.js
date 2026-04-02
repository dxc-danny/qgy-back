#!/usr/bin/env node
/**
 * qgy-back-rules 路由查询脚本
 * 根据关键词查询对应的规则文件和 Skill
 */

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

const RULES_DIR = path.dirname(__dirname);
const DATA_DIR = path.join(RULES_DIR, 'data');
const SCENARIO_CSV = path.join(DATA_DIR, 'scenario-rules.csv');

// 解析 CSV
function parseCSV(content) {
  const lines = content.trim().split('\n');
  const headers = lines[0].split(',');
  return lines.slice(1).map(line => {
    const values = line.split(',');
    const obj = {};
    headers.forEach((h, i) => obj[h.trim()] = values[i]?.trim() || '');
    return obj;
  });
}

// 加载规则文件
function loadRule(ruleName) {
  const rulePath = path.join(RULES_DIR, 'rules', `${ruleName}.yaml`);
  if (fs.existsSync(rulePath)) {
    const content = fs.readFileSync(rulePath, 'utf-8');
    return yaml.load(content);
  }
  return null;
}

// 查询规则
function queryRules(keyword) {
  const csvContent = fs.readFileSync(SCENARIO_CSV, 'utf-8');
  const scenarios = parseCSV(csvContent);

  const matched = scenarios.filter(s =>
    s.关键词.includes(keyword) ||
    s.场景.includes(keyword)
  );

  if (matched.length === 0) {
    console.log(`未找到匹配"${keyword}"的规则`);
    return;
  }

  console.log(`\n=== 匹配"${keyword}"的规则 ===\n`);

  matched.forEach(m => {
    console.log(`场景: ${m.场景}`);
    console.log(`加载规则: ${m.加载规则}`);
    console.log(`加载Skill: ${m.加载Skill}`);
    console.log('---');
  });

  // 加载规则详情
  const rulesToLoad = [...new Set(matched.map(m => m.加载规则).filter(Boolean))];
  console.log('\n=== 规则详情 ===\n');

  rulesToLoad.forEach(ruleName => {
    if (ruleName && ruleName !== '-') {
      const rule = loadRule(ruleName);
      if (rule) {
        console.log(`\n【${rule.name}】`);
        rule.rules.slice(0, 5).forEach(r => {
          console.log(`  [${r.level}] ${r.id}: ${r.description}`);
        });
        if (rule.rules.length > 5) {
          console.log(`  ... 共 ${rule.rules.length} 条规则`);
        }
      }
    }
  });
}

// 主函数
const keyword = process.argv[2] || '分页';
queryRules(keyword);
