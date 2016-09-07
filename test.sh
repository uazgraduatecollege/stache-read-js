#!/usr/bin/env bash
STACHENUM=11534
STACHEKEY=a0297d708e12b0dc38e62f169bc11229794eb57c95c6567c634958f9498ff70d
content=$(curl -H "X-STACHE-READ-KEY: $STACHEKEY" https://stache.arizona.edu/api/v1/item/read/$STACHENUM)
echo $content

#config=$(echo $content| jq '.purpoose' | sed 's/^.\(.*\).$/\1/' | sed 's/\\t/ /g' | sed 's/\\"/"/g' | sed 's/\\\\\\r\\n/ /g' | sed 's/\\r\\n/\n/g' )
#db=$(echo $content| jq '.secret' | sed 's/^.\(.*\).$/\1/' | sed 's/\\t/ /g' | sed 's/\\"/"/g' | sed 's/\\\\\\r\\n/ /g' | sed 's/\\r\\n/\n/g' )
#key=$(echo $content| jq '.memo' | sed 's/^.\(.*\).$/\1/' | sed 's/\\"/"/g' | sed 's/\\\\\\r\\n//g' | sed 's/\\r\\n//g' | base64 -d )
#cat > /var/www/html/config/myconfigfile.php << EOF1
#$config
#EOF1
#cat > /var/www/html/config/database.php << EOF1
#$db
#EOF1
#cat > /usr/local/etc/mycertkey.key << EOF1
#$key
#EOF1

