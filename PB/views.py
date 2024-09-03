import json
from django.http import StreamingHttpResponse
from django.shortcuts import render
import asyncio


# Create your views here.
def PB1(request):
    return render(request, 'PB1.html')


async def sourcesB(request):
    async def event_streamB():
        while True:
            data = json.dumps({'foo': 'BBB'})
            yield f'data:{data}'
            await asyncio.sleep(1)

    response = StreamingHttpResponse(event_streamB())
    response['Cache-Control'] = 'no-cache'
    response['Content-Type'] = 'text/event-stream'
    response['Connection'] = 'keep-alive'
    response.flush()
    return response
