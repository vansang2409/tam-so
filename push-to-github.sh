#!/usr/bin/env bash
# Đẩy Tam Sở lên GitHub: github.com/vansang2409/tam-so
cd "$(dirname "$0")" || exit 1
git init
git add .
git commit -m "Tam So v2.2 - Tarot, Than so hoc, Tu vi, Cung hoang dao, Kinh Dich"
git branch -M main
git remote remove origin 2>/dev/null
git remote add origin https://github.com/vansang2409/tam-so.git
git push -u origin main
echo "Xong! Mở: https://github.com/vansang2409/tam-so"
