version=`date +%s`
echo ${version}
echo 'start build'
ng build --prod --deploy-url https://cdn.jsdelivr.net/gh/pcrgvg/statics@${version}/static/
cd ../../pcrgvg_statics
git add -A
git commit -m "commit ${version}"
git push origin master

