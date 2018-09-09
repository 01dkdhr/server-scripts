#encoding: utf-8

import urllib2
import re
import time

from models.stock.StockBaseModel import StockBaseModel

base_model_url = 'http://quote.eastmoney.com/stocklist.html'

class StockCrawlerService(object):
    # 网络抓取股票数据
    def __init__(sefl):
        super(StockCrawlerService, self).__init__()
    
    @staticmethod
    def fetchAllStockBaseModules():
        # 从东方财富网抓取所有股票代码、名字及所属市场
        try:
            response = urllib2.urlopen(urllib2.Request(base_model_url)).read()
            pattern = re.compile(r'(<li><a target="_blank" href="http://quote\.eastmoney\.com/.+\.html">.+\(\d{6}\)</a></li>)', re.MULTILINE)
            rows = pattern.findall(response)
            
            pattern = re.compile(r'<li><a target="_blank" href="http://quote\.eastmoney\.com/([a-zA-Z]{2,})\d+\.html">(.+)\((\d{6})\)</a></li>')
            for row in rows:
                matches = pattern.match(row)
                if matches:
                    # 去掉基金，证券等信息
                    stockCode = matches.group(3).decode('gbk')
                    if stockCode.startswith('600') or stockCode.startswith('601') or stockCode.startswith('603') \
                                or stockCode.startswith('002') or stockCode.startswith('300') or stockCode.startswith('000'):
                        stockBaseModel = StockBaseModel(None, 
                            matches.group(3), 
                            matches.group(2).decode('gbk').encode('utf-8'),
                            matches.group(1))
        except urllib2.HTTPError, e:
            print e
        except Exception, e:
			print e
        finally:
            pass
