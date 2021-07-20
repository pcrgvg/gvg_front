version=`date +%s`
echo ${version}
echo 'start build'
ng build --configuration production --deploy-url https://cdn.jsdelivr.net/gh/pcrgvg/statics@${version}/static/
cd ../../pcrgvg_statics
git add -A
git commit -m "auto ${version}"
git push origin master

