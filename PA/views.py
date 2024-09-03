import json
import asyncio

from django.shortcuts import render
from django.http import JsonResponse, StreamingHttpResponse, HttpResponse, HttpResponseNotAllowed
from channels.generic.websocket import AsyncWebsocketConsumer


# Create your views here.
def PA1(request):
    return render(request, 'PA1.html')


async def sourcesA(request):
    async def event_streamA():
        while True:
            data = json.dumps({'foo': 'AAA'})
            yield f'data:{data}'
            await asyncio.sleep(1)

    response = StreamingHttpResponse(event_streamA())
    response['Cache-Control'] = 'no-cache'
    response['Content-Type'] = 'text/event-stream'
    response['Connection'] = 'keep-alive'
    response.flush()
    return response


class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        await self.accept()

    async def disconnect(self, close_code):
        pass

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json['message']
        await self.send(text_data=json.dumps({
            'message': message
        }))
