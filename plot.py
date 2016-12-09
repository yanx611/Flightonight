import PyV8
ctx = PyV8.JSContext()

import plotly.plotly as py
import plotly.graph_objs as go

# Create random data with numpy
import numpy as np

#Try to interpret javascript
class MockDocument(object):

    def __init__(self):
        self.value = ''

    def write(self, *args):
        self.value += ''.join(str(i) for i in args)


class Global(PyV8.JSClass):
    def __init__(self):
        self.document = MockDocument()

scope = Global()
ctx = PyV8.JSContext(scope)
ctx.enter()
ctx.eval(js)

N = 100
random_x = np.linspace(0, 1, N)
random_y0 = np.random.randn(N)+5
random_y1 = np.random.randn(N)
random_y2 = np.random.randn(N)-5

# Create traces
trace0 = go.Scatter(
    x = random_x,
    y = random_y0,
    mode = 'trend',
    name = 'trend'
)
trace1 = go.Scatter(
    x = random_x,
    y = random_y1,
    mode = 'price',
    name = 'price'
)
trace2 = go.Scatter(
    x = random_x,
    y = random_y2,
    mode = 'dotted price',
    name = 'dotted price'
)
data = [trace0, trace1, trace2]

# Plot 
py.iplot(data, filename='line-mode')
print scope.document.value

